#include <stdio.h>
int main()
{
    printf("hello, world");
    //使用未知的转意字符会报错
    //printf("hello, world\c");
    printf("hello, world\n");
    return 0;  //返回0表示告诉执行环境程序的状态是0,正常终止, 不建议用void main省略return
}
