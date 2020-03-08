# CI/CD Workshop - Pokedex

[![Build Status](https://travis-ci.com/ofirattia/pokedex.svg?branch=master)](https://travis-ci.com/ofirattia/pokedex)


List of pokemons on the basis of React + Redux

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


# Setup Instructions

1. Make sure you have JAVA (java version "1.8.0_201") installed on your machine
2. Git installed - https://git-scm.com/downloads
3. GitHub Account
4. NodeJS - go to nodejs.org and download the LTS version.
5. Workshop instructions related to Windows.



## Jenkins

1. Go to https://jenkins.io/download/ and download the LTS according to your OS.
2. Extract the folder to a dedicated place.
3. Open the CMD ( Administrator Mode ), access the jenkins folder and execute the following command to start the server - ```java -jar jenkins.war``` and follow the instructions, the web interface will be opened automatically ( including installation of recommended plugins, e.g gitSCM ) once the server is up and running.
4. If you need more information how to install it, you can see here: https://dzone.com/articles/how-to-install-jenkins-on-windows


## Nexus
1. Go to https://www.sonatype.com/download-oss-sonatype and download Nexus Repository Manager OSS 3.x
2. Extract it to a dedicated folder
3. Open the CMD (Administartor Mode ), access the nexus folder under bin via the CMD and execute the following command to start the server - ```nexus /run```
4. default credentials are admin and admin123
5. Server will run on port 8081, if you still face issues you can go to here: https://help.sonatype.com/learning/repository-manager-3/first-time-installation-and-setup/lesson-1%3A--installing-and-starting-nexus-repository-manager



## Github
1. If you dont have account on GitHub, create one
2. Fork the following repository: 
3. Clone it to your machine
4. Run ```npm install``` and ```npm start``` to see that the app is working.

## Heroku
1. Go to https://devcenter.heroku.com/articles/heroku-cli#download-and-install and follow the instructions to setup Heroku CLI on your machine
2. Verify your installation according to the instructions here: https://devcenter.heroku.com/articles/heroku-cli#verifying-your-installation


# Create Your First App
1. Access your app folder ( the one that you forked ), open the CMD and execute the following command: ```heroku create```
2. You should see the following: 
```
Creating app... done, ⬢ sleepy-meadow-81798
https://sleepy-meadow-81798.herokuapp.com/ | https://git.heroku.com/sleepy-meadow-81798.git
```
3. Access the URL and validate the you see the app is running

# Integrating Jenkins with Continous Integration & Depoloyments
This job have few variations of implementations, we will go on the custom implementation since we are taking in consideration that in every group there are different needs when using Jenkins to automate processes.

1. Go to Jenkins URL and create new JOB, every job described as XML file, you can access the jenkins folder (The location should be here assuming you start it in administrator mode which this is the preferred option: C:\Users\YOUR_USER_NAME\.jenkins\jobs\YOUR_JOB_NAME) and just replace the file with the configuration in step no 2.
2. Follow the configuration below:
```xml
<?xml version='1.1' encoding='UTF-8'?>
<matrix-project plugin="matrix-project@1.14">
  <actions/>
  <description>&#xd;
</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <hudson.model.ParametersDefinitionProperty>
      <parameterDefinitions>
        <hudson.model.BooleanParameterDefinition>
          <name>CREATE_HEROKU</name>
          <description>CREATE HORUKO FOR THE FIRST TIME</description>
          <defaultValue>false</defaultValue>
        </hudson.model.BooleanParameterDefinition>
      </parameterDefinitions>
    </hudson.model.ParametersDefinitionProperty>
  </properties>
  <scm class="hudson.plugins.git.GitSCM" plugin="git@4.0.0">
    <configVersion>2</configVersion>
    <userRemoteConfigs>
      <hudson.plugins.git.UserRemoteConfig>
        <url>https://github.com/ofirattia/pokedex</url>
      </hudson.plugins.git.UserRemoteConfig>
    </userRemoteConfigs>
    <branches>
      <hudson.plugins.git.BranchSpec>
        <name>*/master</name>
      </hudson.plugins.git.BranchSpec>
    </branches>
    <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
    <submoduleCfg class="list"/>
    <extensions>
      <hudson.plugins.git.extensions.impl.MessageExclusion>
        <excludedMessage>(?s).*SKIP.*</excludedMessage>
      </hudson.plugins.git.extensions.impl.MessageExclusion>
    </extensions>
  </scm>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers>
    <hudson.triggers.SCMTrigger>
      <spec>* * * * *</spec>
      <ignorePostCommitHooks>false</ignorePostCommitHooks>
    </hudson.triggers.SCMTrigger>
  </triggers>
  <concurrentBuild>false</concurrentBuild>
  <axes/>
  <builders>
    <hudson.tasks.BatchFile>
      <command>npm i rimraf -g</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>if &quot;%CREATE_HEROKU%&quot; == &quot;false&quot; (cd pokedex &amp;&amp; git pull)</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>if &quot;%CREATE_HEROKU%&quot; == &quot;true&quot; (rimraf pokedex &amp;&amp; git clone https://github.com/ofirattia/pokedex)</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>if &quot;%CREATE_HEROKU%&quot; == &quot;true&quot; (cd pokedex &amp;&amp; heroku create)&#xd;
</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>cd pokedex</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>cd pokedex &amp;&amp; npm i &amp;&amp; npm run test</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>cd pokedex &amp;&amp; git add . &amp;&amp; npm version patch -m &quot;JENKINS-VERSIONING SKIP-CI [skip travis]&quot; &amp;&amp; git add -A &amp;&amp; git diff-index --quiet HEAD || git commit -m &quot;JENKINS-VERSIONING SKIP-CI [skip travis]&quot; &amp;&amp; git pull &amp;&amp; git push --force&#xd;
&#xd;
&#xd;
&#xd;
</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>cd pokedex &amp;&amp; npm publish --registry http://localhost:8081/repository/npm-local/</command>
    </hudson.tasks.BatchFile>
    <hudson.tasks.BatchFile>
      <command>cd pokedex &amp;&amp; git pull &amp;&amp; git push heroku master &amp;&amp; git push origin master</command>
    </hudson.tasks.BatchFile>
  </builders>
  <publishers/>
  <buildWrappers/>
  <executionStrategy class="hudson.matrix.DefaultMatrixExecutionStrategyImpl">
    <runSequentially>false</runSequentially>
  </executionStrategy>
</matrix-project>
```
3. After changing this JOB xml, you will see the job configuration under "Configure" when you click on your job.
4. The job comes with one configuration to "CREATE HEROKU APP" if its the first time when you run the job, after that all the build will use the created heroku app.
5. The job is polling the GIT repository ( you can see it in the configuration ) and once there is a change, it will trigger the process, taking latest code from git, doing installaion of dependencies ( here we are using node based app so we are using npm for the dependency installation ), running build and push it to heroku remote to trigger deployment on heroku.
6. In the end, you will have jenkins running, nexus running, git repository and your app running on heroku, we will make them work together in a process to allow integration and deployment.


## Required NPM Modules

Make sure you have ```rimraf``` installed globally, run in CMD ```npm i rimraf -g``` - we are using it for cleaning a folder.

## Notes
1. To be able to push modules to nexus you need to login via NPM to your nexus registry in order to create auth token, the token structure should be in your .npmrc file located under Users folder (C:\Users\YOUR_USER\ .npmrc).
  ```js
  _auth=ZGVwbG95OmRlcGxveQ== 
  ```
  the auth string is the encoded user:password string in base64, in this sample its deploy:deploy, a user that created on nexus to allow deployments.

2. On nexus you will need to create a repository, its a place to store the versions of the artifcats:
- Open the Nexus Repository Manager user interface.
- Click Administration in the top navigation menu, and then select Repositories.
- Click Create repository, and then choose the npm recipe from the list, its a local repository.
- Click Create repository to complete the form.
- You can access your registry ( assuming you called it npm-local ) as following - http://localhost:8081/repository/npm-local/
