# tf-openscience-blockchain
Terraform module for Open Science blockchain

# To deploy
## Initialize the modules (onetime only)
``` bash
bash deploy .env <<< init
```

## To check the resources to be provisioned (optional)
``` bash
bash deploy .env <<< plan
```
## To deploy
``` bash
bash deploy .env <<< deploy
```