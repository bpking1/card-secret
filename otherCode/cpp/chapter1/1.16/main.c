#include <stdio.h>
#define MAXLINE 1000 /* maximum input line length */

int getline(char line[], int maxline);
void copy(char to[], char from[]);
/* print the longest input line */
int main()
{
    int len;                /* current line length */
    int max;                /* maximum length seen so far */
    int nextlen;            /* next line length*/
    char line[MAXLINE];     /* current input line */
    char longest[MAXLINE];  /* longest line saved here */
    char nextline[MAXLINE]; /* next line*/
    max = 0;
    while ((len = getline(line, MAXLINE)) > 0)
        //如果超出了最大长度1000(实际i是0-999),就接着读,直到读到\n,这行结束
        if (len == MAXLINE - 1)
        {
            nextlen = len;
            while (nextlen == MAXLINE - 1)
            {
                nextlen = getline(nextline, MAXLINE);
                len += nextlen; //将剩下的句子的长度加到句子长度上
            }
        }

    if (len > max)
    {
        max = len;
        copy(longest, line);
    }
    if (max > 0) /* there was a line */
        printf("%s", longest);
    return 0;
}
/* getline:  read a line into s, return length  */
int getline(char s[], int lim)
{
    int c, i;
    for (i = 0; i < lim - 1 && (c = getchar()) != EOF && c != '\n'; ++i)
        s[i] = c;
    if (c == '\n')
    {
        s[i] = c;
        ++i;
    }
    s[i] = '\0';
    return i;
}
/* copy:  copy 'from' into 'to'; assume to is big enough */
void copy(char to[], char from[])
{
    int i;
    i = 0;
    while ((to[i] = from[i]) != '\0')
        ++i;
}