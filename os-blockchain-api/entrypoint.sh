#! /bin/sh
set -e
REPODIR=/app
LOCALCA=/opt/home/managedblockchain-tls-chain.pem

#update the connection profiles with endpoints and other information
sed -i "s|%PEERNODEID%|$PEERNODEID|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%MEMBERID%|$MEMBERID|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%ORDERINGSERVICEENDPOINT%|$ORDERINGSERVICEENDPOINT|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%ORDERINGSERVICEENDPOINTNOPORT%|$ORDERINGSERVICEENDPOINTNOPORT|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%PEERSERVICEENDPOINT%|$PEERSERVICEENDPOINT|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%PEERSERVICEENDPOINTNOPORT%|$PEERSERVICEENDPOINTNOPORT|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%PEEREVENTENDPOINT%|$PEEREVENTENDPOINT|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%CASERVICEENDPOINT%|$CASERVICEENDPOINT|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%ADMINUSER%|$ADMINUSER|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%ADMINPWD%|$ADMINPWD|g" $REPODIR/connection_profile/connection-profile.yaml
sed -i "s|%CHANNEL%|$CHANNEL|g" $REPODIR/connection_profile/connection-profile.yaml

sed -i "s|%ADMINUSER%|$ADMINUSER|g" $REPODIR/config.json
sed -i "s|%ADMINPWD%|$ADMINPWD|g" $REPODIR/config.json
sed -i "s|%CHANNEL%|$CHANNEL|g" $REPODIR/config.json
sed -i "s|%CHAINCODENAME%|$CHAINCODENAME|g" $REPODIR/config.json



cp $REPODIR/connection_profile/connection-profile.yaml /tmp/data/connection-profile.yaml
cp $REPODIR/config.json /tmp/data/config.json
node app.js
