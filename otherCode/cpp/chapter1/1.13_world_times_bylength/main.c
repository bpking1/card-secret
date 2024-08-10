#include<stdio.h>
#define IN 1 // inside a word  注意 define没有分号结尾
#define OUT 0 // outside a word
#define LENGTH 15 //单词长度

int main(int argc, char const *argv[])
{
    int c, i, state, wl, nw;
    int nwl[LENGTH];  //不同单词长度的个数 只统计了20个字符以内的
    c =  wl = nw  = 0;

    //忘了初始化数组了..
    for (i = 0; i < LENGTH; i++)
    {
        nwl[i] = 0;
    }
    
    state = OUT;
    //接收输入,不能是 EOF
    while ((c = getchar())!= EOF)
    {
        if (c == ' ' || c== '\n' || c == '\t')
        {
            state = OUT;
        }
        else
        {
            state = IN;
        }
        
        if (state == IN)
        {
            wl ++;
        }
        
        if (state == OUT)
        {
            //如果单词长度超过了最大长度15,则按15算
            if (wl>=LENGTH)
            {
                ++nwl[LENGTH];
            }
            else
            {
                ++nwl[wl];
            }
            ++nw;
            wl = 0;
        }
        
    }
    printf("单词个数: %d\n",nw);
    printf("不同单词长度出现次数:\n");
    for (i = 0; i < LENGTH; i++)
    {
        printf("单词长度%2d:   ",i);
        //printf("%d",nwl[i]);
        for (int j = 0; j < nwl[i]; j++)
        {
            printf("*");
        }
        printf("\n");
        
    }

    
    
    //判断单词结束,碰到换行,空,制表符就算结束,通过state 为IN或OUT来标记是否结束
    //记下单词的长度
    //根据单词长度记录个数,用数组来存各个长度单词个数
    
    return 0;
}
