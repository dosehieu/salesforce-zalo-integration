pipeline {
    agent any
    stages {
        stage('Clone stage') {
            steps {
                git 'https://github.com/dosehieu/salesforce-zalo-integration.git'
            }
        }
        stage('Build stage') {
            steps {
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    sh label: '', script: 'docker build -t dosehieu/test-node:v1 .'
                    sh label: '', script: 'docker push dosehieu/test-node:v1 .'
                }
            }
        }
    }
}