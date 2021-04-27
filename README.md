# Part 5 - Uber-bus frontend


# Introduction 
   -  It is MERN stack web application with provisioning and configuration management done using Terraform, Ansible and Jenkins to deploy application on Google Cloud Platform
   -  Customer can book a bus during particular time period with a source and destination which are again fetched via locations google API
   -  We can view all the bookings or even modify them.

# Technical Stack
   - Google Cloud Platform
   - ReactJs
   - Nginx
   - Provisioning and Configuration Management: Terraform

# Prerequisites
   - NodeJs
   - React
   - MongoDb Client

# Configuration

1. Setup a new jenkins pipeline `frontend-uber` on the jenkins server which was created in `part 2` repository. Configure the pipeline to point to the correct repository url and use the credential created in `part 2`

2. Create a webhook for the same on the github repository like `http://<<Elastic-Ip-Here>>:8080/github-webhook/`

3. Now, when a commit is created and pushed, github will trigger the pipeline. This will create a docker image and push it to the docker hub. Change the docker image name to point it to the correct user

4. Lastly, the `helm` service on the jenkins server will set the current context to `GCP` cluster, and release a helm chart with service and deployment on the cluster
   
   
