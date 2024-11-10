pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Angular App') {
            steps {
                bat 'ng build --configuration production'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'ng test --watch=false'
            }
        }

        stage('Lint') {
            steps {
                bat 'ng lint'
            }
        }

        stage('Build Docker Image') {
             steps {
                           dir('frontend-laboratoire') {
                               bat 'docker build -t loubnaidm/frontend-laboratoire:latest .'
                           }
        }
}
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-credentials-id') {
                        bat "docker push frontend-laboratoire:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f deployment.yaml'
            }
        }
    }
}
