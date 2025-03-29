@echo off
setlocal enabledelayedexpansion

rem 遍历当前目录中的所有文件
for %%f in (lol_*) do (
    rem 获取文件名，不包括扩展名
    set "filename=%%~nf"
    set "extension=%%~xf"
    
    rem 使用字符串替换删除 lol_ 前缀并添加 myg_ 前缀
    set "newname=myg_!filename:lol_=!!extension!"
    
    rem 重命名文件
    ren "%%f" "!newname!"
)

echo 完成重命名。
pause
