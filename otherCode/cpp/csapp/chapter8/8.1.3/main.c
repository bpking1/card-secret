#include<unistd.h>

ssize_t read(int fd, void *buf, size_t n);

ssize_t write(int fd, const void *buf, size_t n);

int main()
{
    write(1, "hello, world\n", 13);
    _exit(0);
}