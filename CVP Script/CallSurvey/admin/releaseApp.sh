#!/bin/sh

#  Copyright (c) 1999-2010 Cisco Systems, Inc
#  All rights reserved

$CVP_HOME/jre/bin/java -classpath "../../../admin/admin.jar:../../../lib/framework.jar" com.audium.client.admin.AppDelete "$PWD" $1 $2
