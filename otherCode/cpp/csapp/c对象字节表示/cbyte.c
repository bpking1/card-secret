#include <stdio.h>

typedef unsigned char *byte_pointer;





void show_bytes(byte_pointer start, size_t len){
    size_t i;
    for ( i = 0; i < len; i++)
    {
        printf(" %.2x", start[i]);
    }
    printf("\n");
    
}

void show_int(int x) {
    show_bytes((byte_pointer) &x, sizeof(int));
}

void show_float(float x) {
    show_bytes((byte_pointer) &x, sizeof(float));
}

void show_double(double x) {
    show_bytes((byte_pointer) &x, sizeof(double));
}

void show_pointer(void *x) {
    show_bytes((byte_pointer) &x, sizeof(void *));
}

void show_char(char x) {
    show_bytes((byte_pointer) &x, sizeof(char));
}


void test_show_bytes(int val) {
    int ival = val;
    float fval = (float) ival;
    int *pval = &ival;
    show_int(ival);
    show_float(fval);
    show_pointer(pval);
}

void test_show_char_bytes(char val) {
    int ival = val;
    float fval = (float) ival;
    double dval = (double) ival;
    int *pval = &ival;
    show_char(val);
    show_int(ival);
    show_float(fval);
    show_double(dval);
    show_pointer(pval);
}

void main()
{
    //test_show_bytes(12345);
    char str[] = "哈哈哈哈";
    for (int i = 0; i < 13; i++)
    {
        test_show_char_bytes(str[i]);
    }
    size_t x = sizeof(long double);
    printf("%lu\n", x);
    printf("%lu %lu %lu %lu %lu %lu %lu %lu %lu %lu ",sizeof(char),sizeof(short int),sizeof(int),sizeof(long),sizeof(long int),sizeof(float),sizeof(double),sizeof(long double),sizeof(long long),sizeof(long long int));
    
}

