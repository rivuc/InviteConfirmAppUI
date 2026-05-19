pipeline {
    agent any
	
    tools {
        nodejs 'NodeJS'
    }
	
	environment {
        CI = 'true'
    }
	
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
		
        stage('Install dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci --registry=https://registry.npmjs.org'
            }
        }
		
		stage('Unit Tests') {
			steps {
				sh 'npm run test:ci:coverage'
			}
			post {
				always {
					junit(
						testResults: 'coverage/junit/TESTS-results.xml',
						allowEmptyResults: false
					)
					recordCoverage(
						tools: [[parser: 'LCOV', pattern: 'coverage/lcov.info']],
						id: 'coverage',
						name: 'Coverage Report'
					)
				}
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
		always   { cleanWs() }
    }
}