## 验证表达式 getchar() != EOF的值是0还是1

EOF是 end of file的简写,定义在stdio.h中,并不是说文件结尾有这个符号,而是linux io会根据文件长度判断文件是否结束,然后发出信号 -1即 EOF,出现错误也是-1,是一个整形数,所以要int来接收
getchar()是获取输入,linux下 输入EOF是 ctrl + D