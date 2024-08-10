package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"github.com/spf13/viper"
)

type AlistRequest struct {
	Path     string `json:"path"`
	Password string `json:"password"`
}

type AlistResponse struct {
	Data struct {
		RawURL string `json:"raw_url"`
	} `json:"data"`
}

type MediaItem struct {
	ID         int
	MediaParts []MediaPart
}

type MediaPart struct {
	ID   int
	File string
}

func main() {
	viper.SetConfigFile("config.yaml")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("failed to read config file: %v", err)
	}
	dbPath := viper.GetString("plex.dbPath")
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	mountPath := viper.GetString("plex.mountPath")
	alistDrivePath := viper.GetString("alist.drivePath")

	r := mux.NewRouter()
	r.HandleFunc("/library/parts/{id:[0-9]+}/{number:[0-9]+}/file{.*}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		fileId, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			log.Println(err)
			return
		}

		log.Printf("fileId: %d", fileId)

		var filePath string
		err = db.QueryRow("SELECT file FROM media_parts WHERE id = ?", fileId).Scan(&filePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Println(err)
			return
		}

		log.Printf("filePath: %s", filePath)

		alistReqPath := strings.Replace(filePath, mountPath, alistDrivePath, 1)

		log.Print("alistReqPath: %s" + alistReqPath)

		rawURL, err := getRawURL(alistReqPath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Println(err)
			return
		}

		log.Printf("rawURL: %s", rawURL)

		http.Redirect(w, r, rawURL, http.StatusFound)
	})

	r.HandleFunc("/video/:/transcode/universal/start.mpd", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Query().Get("path")
		if path == "" {
			log.Println("path is null")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		metadataID, err := strconv.Atoi(strings.Split(path, "/")[len(strings.Split(path, "/"))-1])
		if err != nil {
			log.Fatal(err)
		}

		stmt, err := db.Prepare(`SELECT mi.id as media_id, mp.id as part_id, mp.file 
			FROM media_items AS mi
			LEFT JOIN media_parts AS mp ON mp.media_item_id = mi.id
			WHERE mi.metadata_item_id = ?`)
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()

		rows, err := stmt.Query(metadataID)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		mediaItems := make([]MediaItem, 0)
		for rows.Next() {
			var mediaID, partID int
			var file string
			err := rows.Scan(&mediaID, &partID, &file)
			if err != nil {
				log.Fatal(err)
			}

			found := false
			for i := range mediaItems {
				if mediaItems[i].ID == mediaID {
					mediaItems[i].MediaParts = append(mediaItems[i].MediaParts, MediaPart{ID: partID, File: file})
					found = true
					break
				}
			}
			if !found {
				mediaItems = append(mediaItems, MediaItem{ID: mediaID, MediaParts: []MediaPart{{ID: partID, File: file}}})
			}
		}

		if len(mediaItems) == 0 {
			log.Println("metadataID:", metadataID, "not found")
			http.NotFound(w, r)
			return
		}

		mediaIndex, err := strconv.Atoi(r.URL.Query().Get("mediaIndex"))
		if err != nil {
			log.Println("mediaIndex is null or invalid")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		partIndex, err := strconv.Atoi(r.URL.Query().Get("partIndex"))
		if err != nil {
			log.Println("partIndex is null or invalid")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if mediaIndex >= len(mediaItems) || partIndex >= len(mediaItems[mediaIndex].MediaParts) {
			log.Println("mediaIndex or partIndex is out of range")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		mediaItem := mediaItems[mediaIndex]
		mediaPart := mediaItem.MediaParts[partIndex]
		filePath := mediaPart.File

		alistReqPath := strings.Replace(filePath, mountPath, alistDrivePath, -1)
		log.Println("filePath:", filePath)
		log.Println("alistReqPath:", alistReqPath)

		rawURL, err := getRawURL(alistReqPath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Println(err)
			return
		}

		log.Printf("rawURL: %s", rawURL)

		http.Redirect(w, r, rawURL, http.StatusFound)
	})

	log.Print("Server listening on port 18080")
	log.Fatal(http.ListenAndServe(":18080", r))
}

func getRawURL(path string) (string, error) {
	alistURL := viper.GetString("alist.url")
	alistToken := viper.GetString("alist.token")
	alistReq := AlistRequest{
		Path:     path,
		Password: "",
	}
	alistReqData, err := json.Marshal(alistReq)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", alistURL, bytes.NewBuffer(alistReqData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", alistToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Println("alist resp.StatusCode:", resp.StatusCode)
		return "", err
	}

	var alistRes AlistResponse
	err = json.NewDecoder(resp.Body).Decode(&alistRes)
	if err != nil {
		return "", err
	}

	return alistRes.Data.RawURL, nil
}
