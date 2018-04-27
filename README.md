# question

问卷系统demo

操作步骤：

1.下载源码到本地

2.编译前端代码
  cd front
  npm install
  npm run build
  
3.自己在本地安装MongoDB数据库，启动MongoDB数据库

4.cd models 修改mongodb.js代码中数据库地址

5.cd config 修改login部分，注释掉查表过程，直接返回一个字段

6.npm run start启动程序

7.访问http://localhost:3000/index.html#/admin/record/list 进入小问卷后台，执行增删改查
