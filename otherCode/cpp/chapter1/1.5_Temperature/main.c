#include <stdio.h>
//符号常量,跟const差不多意思, EOF也是符号常量定义在stdio.h中
#define LOWER 0   /* lower limit of table */
#define UPPER 300 /* upper limit */
#define STEP 20   /* step size */

int main(int argc, char const *argv[])
{
    int fahr;
    for (fahr = UPPER; fahr >= LOWER; fahr -= STEP)
    {
        printf("%3d %6.1f\n", fahr, (5.0 / 9.0) * (fahr - 32));
    }

    return 0;
}
