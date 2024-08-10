#include <stdio.h>
int main(int argc, char const *argv[])
{
    int c;
    c = getchar() != EOF; // !=的优先级比 =要高,所以结果为0或1
    printf("%d\n",c);
    return 0;
}
