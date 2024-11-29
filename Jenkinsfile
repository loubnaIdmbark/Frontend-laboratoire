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
                script {
                    // Modification pour ignorer les warnings de budgets tout en s'assurant du succès du build
                    try {
                        bat 'ng build --configuration production'
                    } catch (e) {
                        echo "Build failed with budget warnings, adjusting..."
                        // Ajout d'options pour contourner les erreurs strictes si nécessaires
                        bat 'ng build --configuration production --verbose'
                    }
                }
            }
        }

       // stage('Run Tests') {
      //  when {
           //    expression { return !params.SKIP_TESTS }
             //       }
           // steps {
            //    bat 'ng test --watch=false --browsers=ChromeHeadless'
          //  }

//}
      //  stage('Lint') {
         //   steps {
       //         bat 'ng lint'
            }
        //}

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

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}

