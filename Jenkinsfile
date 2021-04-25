node {

    stage('Checkout Code') {
        git branch: 'main', credentialsId: 'github-sajal', url: 'https://github.com/devops-csye7220/frontend-uber'
    }

    stage('Docker Build and Push') {
        withCredentials([string(credentialsId: 'github-sajal-token', variable: 'GITHUB_TOKEN')]){
            withCredentials([usernamePassword(usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD', credentialsId: 'sajal-dockerhub')]){
                sh """#!/bin/bash
                        GIT_HASH=`git rev-parse HEAD`
                        echo \$GIT_HASH > latest_git_hash
                        docker build  --no-cache \
                                    --force-rm \
                                    -t sajalsood/frontend-uber:\$GIT_HASH  \
                                    -f ./Dockerfile .
                        docker login --username=$DOCKER_USERNAME --password=$DOCKER_PASSWORD
                        docker push sajalsood/frontend-uber:\$GIT_HASH
                    """
            }
        }
    }

    stage('Install Release') {
        sh """#!/bin/bash
                LATEST_GIT_HASH=`cat latest_git_hash`
                if helm status --namespace default frontend-uber &> /dev/null; then
                    helm upgrade --namespace default --set image.tag=\${LATEST_GIT_HASH} frontend-uber ./helm
                else
                    helm install --namespace default --set image.tag=\${LATEST_GIT_HASH} frontend-uber ./helm
                fi
        """
    }
}