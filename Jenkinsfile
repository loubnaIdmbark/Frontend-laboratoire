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
               bat 'docker build -t loubnaidm/frontend-laboratoire:latest -f Dockerfile .'
           }
       }
      stage('Push Docker Image') {
                  steps {
                      withCredentials([usernamePassword(credentialsId: 'docker-credentials-id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                          bat """
                              echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                              docker push loubnaidm/frontend-laboratoire:latest
                          """
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
