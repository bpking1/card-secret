#include <stdio.h>
/* print Fahrenheit-Celsius table
 for fahr = 0, 20, ..., 300; floating-point version */
float fahr2cel(float fahr);

int main()
{
    float fahr, celsius;
    float lower, upper, step;
    lower = 0;   /* lower limit of temperatuire scale */
    upper = 300; /* upper limit */
    step = 20;   /* step size */
    fahr = lower;
    printf("%4s %7s\n","fahr","celsius");
    while (fahr <= upper)
    {
        celsius = fahr2cel(fahr);
        printf("%4.0f %7.1f\n", fahr, celsius);
        fahr = fahr + step;
    }
    return 0;
}

float fahr2cel(float fahr)
{
    return (5.0 / 9.0) * (fahr - 32.0);
}