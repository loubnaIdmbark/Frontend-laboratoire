pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Angular App') {
            steps {
                sh 'ng build --prod'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'ng test --watch=false'
            }
        }

        stage('Lint') {
            steps {
                sh 'ng lint'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("frontend-laboratoire:latest")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-credentials-id') {
                        sh "docker push frontend-laboratoire:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
            }
        }
    }
}
