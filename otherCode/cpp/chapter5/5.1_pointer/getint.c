#include <ctype.h>
#include <stdio.h>
#include "calc.h"

//getint 从输入获取下一个整数,并赋值给数组的指针 *pn
int getint(int *pn)
{
    int c, sign;
    *pn = 0;

    while (isspace(c = getch())) //skip white space
        ;

    if (!isdigit(c) && c != EOF && c != '+' && c != '-')
    {
        //ungetch(c); //这里为啥要 ungetch ?
        return 0; //不是数字或 EOF, +, -, 就return 0了呀
    }
    sign = (c == '-' ? -1 : 1);
    if (c == '+' || c == '-')
        c = getch();
    for (*pn = 0; isdigit(c); c = getch())
        *pn = 10 * *pn + (c - '0');
    *pn *= sign;
    //如果符号后面跟的不是数字,就将符号写回输入流,因为是后进先出,就让后面进的先那个字符先出
    if (*pn == 0)
    {
        ungetch(sign == -1 ? '-' : '+');
    }

    if (c != EOF)
        ungetch(c);
    return c;
}