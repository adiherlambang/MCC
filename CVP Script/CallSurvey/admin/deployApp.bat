@echo off

REM  Copyright (c) 1999-2010 Cisco Systems, Inc
REM  All rights reserved

SETLOCAL

for /f "delims=" %%j in ('cd') do set currDir=%%j
%CVP_HOME%\jre\bin\java -classpath "..\..\..\admin\admin.jar;..\..\..\lib\framework.jar" com.audium.client.admin.AppDeploy "%currDir%" %1

ENDLOCAL

if not {%1} == {noconfirm} pause