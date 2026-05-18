pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                sh 'echo Compilando proyecto...'
            }
        }
        stage('Test') {
            steps {
                sh 'echo Ejecutando pruebas...'
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo Desplegando...'
            }
        }
    }
    post {
        success { echo 'Success' }
        failure { echo 'Fail' }
    }
}