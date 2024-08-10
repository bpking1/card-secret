/*
    内存越界引用和缓冲区溢出
*/
#include <stdio.h>
int main()
{
    return 0;
}

/* Implementation of library function gets() */
char *gets(char *s)
{
    int c;
    char *dest = s;
    while ((c = getchar()) != '\n' && c != EOF)
        *dest++ = c;
    if (c == EOF && dest == s)
    {
        return NULL;
    }
    *dest++ = '\0';
    return s;
}

/*Read input line and write it back*/
void echo()
{
    char buf[8]; /* Way too small! */
    gets(buf);
    puts(buf);
}