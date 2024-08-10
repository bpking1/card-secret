#include <stdio.h>
/* print Celsius-Fahrenheit table
 for Fahrenheit = -17, -6, 4, 15, .. 148; floating-point version */
int main()
{
    float fahr, celsius;
    float lower, upper, step;
    lower = 0;   /* lower limit of temperatuire scale */
    upper = 150; /* upper limit */
    step = 10;   /* step size */
    celsius = lower;
    printf("%7s %4s\n","celsius","fahr");
    while (celsius <= upper)
    {
        fahr = celsius * 9.0 / 5.0 + 32.0;
        printf("%7.0f %4.1f\n", celsius, fahr);
        celsius = celsius + step;
    }
    return 0;
}