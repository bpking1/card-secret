using System.Data.SQLite;
using System.Text.Json.Nodes;

var builder = WebApplication.CreateBuilder(args);
// Config.json 文件中的设置如果有重复的会覆盖默认配置提供程序中的设置，包括环境变量配置提供程序和命令行配置提供程序。 
builder.Configuration.AddJsonFile("config.json", optional: false, reloadOnChange: true);
builder.Services.AddSingleton<HttpClient>(sp =>
{
    var client = new HttpClient();
    var config = sp.GetRequiredService<IConfiguration>();
    var alistToken = config.GetValue<string>("alist:token");
    client.DefaultRequestHeaders.Add("Authorization", alistToken);
    //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    return client;
});

builder.Services.AddSingleton<SQLiteConnection>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var dbPath = config.GetValue<string>("plex:dbPath");
    var conn = new SQLiteConnection($"Data Source={dbPath}");
    conn.Open();
    return conn;
});

var app = builder.Build();

var mountPath = app.Configuration.GetValue<string>("plex:mountPath");
var alistDrivePath = app.Configuration.GetValue<string>("alist:drivePath");
var alistUrl = app.Configuration.GetValue<string>("alist:url");


app.MapGet("/library/parts/{id:int}/{number:int}/file{container}", async (int id, SQLiteConnection db, HttpClient client, IConfiguration config) =>
{
    await using var cmd = new SQLiteCommand("SELECT file FROM media_parts WHERE media_item_id = @id", db);
    cmd.Parameters.AddWithValue("@id", id);
    await using var reader = await cmd.ExecuteReaderAsync();
    if (!await reader.ReadAsync())
    {
        app.Logger.LogInformation("id: {id} not found", id);
        return Results.NotFound();
    }
    var filePath = reader.GetString(0);
    var alistReqPath = filePath.Replace(mountPath, alistDrivePath, StringComparison.OrdinalIgnoreCase);
    app.Logger.LogInformation("filePath: {filePath}", filePath);
    app.Logger.LogInformation("alistReqPath: {alistReqPath}", alistReqPath);

    var resp = await client.PostAsJsonAsync(alistUrl, new { Path = alistReqPath, Password = "" });
    if (!resp.IsSuccessStatusCode)
    {
        app.Logger.LogInformation("alist resp.StatusCode: {resp.StatusCode}", resp.StatusCode);
        return Results.StatusCode((int)resp.StatusCode);
    }
    var alistResData = await resp.Content.ReadAsStringAsync();
    JsonNode? jsonNode = JsonNode.Parse(alistResData);
    var raw_url = jsonNode?["data"]?["raw_url"]?.GetValue<string>();
    app.Logger.LogInformation("raw_url: {raw_url}", raw_url);
    if (string.IsNullOrEmpty(raw_url))
    {
        return Results.StatusCode(500);
    }
    return Results.Redirect(raw_url);
});

// match /video/:/transcode/universal/start.mpd?hasMDE=1&path=%2Flibrary%2Fmetadata%2F18233&mediaIndex=0&partIndex=0, get path
app.MapGet("/video/:/transcode/universal/start.mpd", async (HttpContext context,HttpClient client, SQLiteConnection db) =>
{

    var path = context.Request.Query["path"];
    if (string.IsNullOrEmpty(path))
    {
        app.Logger.LogInformation("path is null");
        return Results.StatusCode(500);
    }
    var metadataId = int.Parse(path.ToString().Split('/').Last());
    string sql = @"SELECT mi.id as media_id, mp.id as part_id, mp.file 
                    FROM media_items AS mi
                    LEFT JOIN media_parts AS mp ON mp.media_item_id = mi.id
                    WHERE mi.metadata_item_id = @metadataId";
    await using var cmd = new SQLiteCommand(sql, db);
    cmd.Parameters.AddWithValue("@metadataId", metadataId);
    List<MediaItem> mediaItems = new();

    await using var reader = await cmd.ExecuteReaderAsync();
    if (!await reader.ReadAsync())
    {
        app.Logger.LogInformation("metadataId: {metadataId} not found", metadataId);
        return Results.NotFound();
    }
    do
    {
        var media_id = reader.GetInt32(0);
        var part_id = reader.GetInt32(1);
        var file = reader.GetString(2);
        if (mediaItems.Any(x => x.id == media_id))
        {
            mediaItems.First(x => x.id == media_id).mediaParts.Add(new MediaPart { id = part_id, file = file });
        }
        else
        {
            mediaItems.Add(new MediaItem { id = media_id, mediaParts = new List<MediaPart> { new MediaPart { id = part_id, file = file } } });
        }
    }
    while (await reader.ReadAsync());
    app.Logger.LogInformation("mediaItems: {mediaItems}", mediaItems.Count);
    // 应该判断mediaitems count是否大于0
    var mediaIndex = context.Request.Query["mediaIndex"];
    if (mediaIndex.Count == 0 || !int.TryParse(mediaIndex, out int mediaIndexValue))
    {
        app.Logger.LogInformation("mediaIndex is null or invalid");
        return Results.StatusCode(500);
    }
    var partIndex = context.Request.Query["partIndex"];
    if (partIndex.Count == 0 || !int.TryParse(partIndex, out int partIndexValue))
    {
        app.Logger.LogInformation("partIndex is null or invalid");
        return Results.StatusCode(500);
    }
    // 要先判断是否越界
    var mediaItem = mediaItems[mediaIndexValue];
    var mediaPart = mediaItem.mediaParts[partIndexValue];
    var filePath = mediaPart.file;
    var alistReqPath = filePath.Replace(mountPath, alistDrivePath, StringComparison.OrdinalIgnoreCase);
    app.Logger.LogInformation("filePath: {filePath}", filePath);
    app.Logger.LogInformation("alistReqPath: {alistReqPath}", alistReqPath);

    var resp = await client.PostAsJsonAsync(alistUrl, new { Path = alistReqPath, Password = "" });
    if (!resp.IsSuccessStatusCode)
    {
        app.Logger.LogInformation("alist resp.StatusCode: {resp.StatusCode}", resp.StatusCode);
        return Results.StatusCode((int)resp.StatusCode);
    }
    var alistResData = await resp.Content.ReadAsStringAsync();
    JsonNode? jsonNode = JsonNode.Parse(alistResData);
    var raw_url = jsonNode?["data"]?["raw_url"]?.GetValue<string>();
    app.Logger.LogInformation("raw_url: {raw_url}", raw_url);
    if (string.IsNullOrEmpty(raw_url))
    {
        return Results.StatusCode(500);
    }
    return Results.Redirect(raw_url);
});

app.Run();

public class MediaItem
{
    public int id { get; set; }
    public List<MediaPart> mediaParts { get; set; }

}
public class MediaPart
{
    public int id { get; set; }
    public string file { get; set; }
}


