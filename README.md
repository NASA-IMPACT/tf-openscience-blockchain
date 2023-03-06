# tf-openscience-blockchain
Terraform module for Open Science blockchain

# To deploy
``` bash
$cp .env.exemple .env
Fill-in the required values 
```
## Initialize the modules (onetime only)
``` bash
bash deploy.sh .env <<< init
```

## To check the resources to be provisioned (optional)
``` bash
bash deploy.sh .env <<< plan
```
## To deploy
``` bash
bash deploy.sh .env <<< deploy
```

## REF
https://github.com/aws-samples/non-profit-blockchain/blob/master/ngo-fabric/README.md