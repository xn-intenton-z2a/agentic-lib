# TEKTON_PIPELINES

## Crawl Summary
Tekton Pipelines provides Kubernetes CRDs for Tasks, TaskRuns, Pipelines, and PipelineRuns. The installation process involves applying a YAML from the Tekton release URL and monitoring pod status. Detailed YAML examples for creating Tasks, TaskRuns, Pipelines, and PipelineRuns are provided, along with commands for deploying and verifying the setup on a minikube Kubernetes cluster. Troubleshooting commands and cluster cleanup procedures are also specified.

## Normalised Extract
## Table of Contents
1. Tekton Pipelines Entities
   - Task
   - TaskRun
   - Pipeline
   - PipelineRun
2. Installation & Setup
   - Creating a Kubernetes Cluster (minikube)
   - Installing Tekton Pipelines
3. Task Execution Example
   - YAML definition for Task
   - YAML definition for TaskRun
   - Commands to apply and verify
4. Pipeline Execution Example
   - YAML definition for goodbye Task
   - Pipeline YAML and PipelineRun YAML
   - Deployment commands and log verification
5. Troubleshooting & Cleanup
   - Cluster troubleshooting commands
   - minikube deletion steps

## 1. Tekton Pipelines Entities
**Task**: Defines sequential steps in a pod.
*YAML:*
```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: hello
spec:
  steps:
    - name: echo
      image: alpine
      script: |
        #!/bin/sh
        echo "Hello World"
```

**TaskRun**: Instantiates Task execution.
*YAML:*
```yaml
apiVersion: tekton.dev/v1beta1
kind: TaskRun
metadata:
  name: hello-task-run
spec:
  taskRef:
    name: hello
```

**Pipeline**: Groups Tasks in a defined order.
*YAML:*
```yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: hello-goodbye
spec:
  params:
  - name: username
    type: string
  tasks:
    - name: hello
      taskRef:
        name: hello
    - name: goodbye
      runAfter:
        - hello
      taskRef:
        name: goodbye
      params:
      - name: username
        value: $(params.username)
```

**PipelineRun**: Executes the Pipeline with parameter values.
*YAML:*
```yaml
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: hello-goodbye-run
spec:
  pipelineRef:
    name: hello-goodbye
  params:
  - name: username
    value: "Tekton"
```

## 2. Installation & Setup
**Kubernetes Cluster with minikube:**
```bash
minikube start --kubernetes-version v1.30.2
kubectl cluster-info
```

**Install Tekton Pipelines:**
```bash
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
kubectl get pods --namespace tekton-pipelines --watch
```

## 3. Task Execution Example
- Create a file `hello-world.yaml` for Task; apply using:
```bash
kubectl apply --filename hello-world.yaml
```
- Create `hello-world-run.yaml` for TaskRun; apply using:
```bash
kubectl apply --filename hello-world-run.yaml
```
- Verify TaskRun status:
```bash
kubectl get taskrun hello-task-run
kubectl logs --selector=tekton.dev/taskRun=hello-task-run
```

## 4. Pipeline Execution Example
- Create a file `goodbye-world.yaml` with parameterized Task:
```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: goodbye
spec:
  params:
  - name: username
    type: string
  steps:
    - name: goodbye
      image: ubuntu
      script: |
        #!/bin/bash
        echo "Goodbye $(params.username)!"
```
- Create and apply `hello-goodbye-pipeline.yaml` and `hello-goodbye-pipeline-run.yaml` as shown in the digest.
- Verify logs using Tekton CLI:
```bash
tkn pipelinerun logs hello-goodbye-run -f -n default
```

## 5. Troubleshooting & Cleanup
- Dump cluster info for debugging:
```bash
kubectl cluster-info dump
```
- Delete minikube cluster:
```bash
minikube delete
```


## Supplementary Details
### Supplementary Technical Specifications
- **Kubernetes Version:** v1.30.2 is used in minikube command.
- **Tekton Pipelines Installation URL:** https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
- **Pod Status Monitoring:** Ensure pods in the tekton-pipelines namespace reach '1/1 Ready'.
- **Parameter Passing:** Pipeline YAML passes a parameter 'username' to the Task 'goodbye'.
- **CLI Verification:** Use 'tkn pipelinerun logs <run-name> -f -n default' for real-time log viewing.
- **Cluster Troubleshooting:** Use 'kubectl cluster-info dump' to diagnose issues.
- **Cleanup Commands:** 'minikube delete' removes the cluster and associated Docker containers.
- **Coding Best Practices:** Each YAML file should have correct indentation and API version supported by Tekton (v1beta1).


## Reference Details
### Complete API Specifications & SDK Method Signatures

#### Task API
- **API Version:** tekton.dev/v1beta1
- **Kind:** Task
- **Required Fields:** metadata.name, spec.steps
- **Step Object:** 
  - name: string
  - image: string
  - script: string (shell script content)

#### TaskRun API
- **API Version:** tekton.dev/v1beta1
- **Kind:** TaskRun
- **Required Fields:** metadata.name, spec.taskRef.name

#### Pipeline API
- **API Version:** tekton.dev/v1beta1
- **Kind:** Pipeline
- **Required Fields:** metadata.name, spec.params, spec.tasks
- **Task in Pipeline:** 
  - name: string
  - taskRef: { name: string }
  - runAfter: list of task names (optional)
  - params: list of parameter assignments (name and value)

#### PipelineRun API
- **API Version:** tekton.dev/v1beta1
- **Kind:** PipelineRun
- **Required Fields:** metadata.name, spec.pipelineRef.name, spec.params

### Code Examples

#### Example: Creating a Task
```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: hello
spec:
  steps:
    - name: echo
      image: alpine
      script: |
        #!/bin/sh
        echo "Hello World"
```

#### Example: Executing a TaskRun
```yaml
apiVersion: tekton.dev/v1beta1
kind: TaskRun
metadata:
  name: hello-task-run
spec:
  taskRef:
    name: hello
```

#### Example: Pipeline with Parameter Passing
```yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: hello-goodbye
spec:
  params:
  - name: username
    type: string
  tasks:
    - name: hello
      taskRef:
        name: hello
    - name: goodbye
      runAfter:
        - hello
      taskRef:
        name: goodbye
      params:
      - name: username
        value: $(params.username)
```

#### Example: PipelineRun to Trigger Pipeline
```yaml
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: hello-goodbye-run
spec:
  pipelineRef:
    name: hello-goodbye
  params:
  - name: username
    value: "Tekton"
```

### Implementation Patterns & Best Practices
- **YAML Validation:** Ensure proper indentation and API version consistency.
- **Parameterization:** Use parameters in Pipeline and Task definitions to enhance reusability.
- **CLI Usage:** Leverage 'kubectl' for applying configurations and 'tkn' for log tracing.
- **Troubleshooting Steps:** 
  1. Check pod status with `kubectl get pods --namespace tekton-pipelines`.
  2. Inspect logs using `kubectl logs --selector=tekton.dev/taskRun=<name>`.
  3. Run `kubectl cluster-info dump` to diagnose cluster issues.

### Specific Configuration Options
- **minikube Start Options:** 
  - `--kubernetes-version v1.30.2` ensures compatibility.
  - Ensure allocated resources (CPUs, Memory) match cluster requirements.
- **Tekton Pipelines Release YAML:** hosted at https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml

### Detailed Troubleshooting Commands
- **View Cluster Info:**
  ```bash
  kubectl cluster-info
  ```
- **Monitor Pod Readiness:**
  ```bash
  kubectl get pods --namespace tekton-pipelines --watch
  ```
- **Delete Cluster:**
  ```bash
  minikube delete
  ```

This reference provides the full, exact technical specifications required for setting up and managing Tekton Pipelines in a Kubernetes environment.

## Original Source
Tekton Pipelines Documentation
https://tekton.dev/docs/pipelines/

## Digest of TEKTON_PIPELINES

# Tekton Pipelines Documentation

**Retrieved Date:** 2023-10-30

## Overview
Tekton Pipelines is a Kubernetes extension that provides a set of Custom Resources to construct CI/CD workflows. It is available via kubectl and API calls, and integrates with Kubernetes native functionality.

## Tekton Entities

### Task
- **Definition:** A Task is a series of steps executed sequentially in a pod.
- **YAML Example:**

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: hello
spec:
  steps:
    - name: echo
      image: alpine
      script: |
        #!/bin/sh
        echo "Hello World"
```

### TaskRun
- **Definition:** Instantiates and executes a Task with specific parameters.
- **YAML Example:**

```yaml
apiVersion: tekton.dev/v1beta1
kind: TaskRun
metadata:
  name: hello-task-run
spec:
  taskRef:
    name: hello
```

### Pipeline
- **Definition:** A collection of Tasks executed in a specified order.
- **YAML Example:**

```yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: hello-goodbye
spec:
  params:
  - name: username
    type: string
  tasks:
    - name: hello
      taskRef:
        name: hello
    - name: goodbye
      runAfter:
        - hello
      taskRef:
        name: goodbye
      params:
      - name: username
        value: $(params.username)
```

### PipelineRun
- **Definition:** Instantiates and executes a Pipeline with provided parameters.
- **YAML Example:**

```yaml
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: hello-goodbye-run
spec:
  pipelineRef:
    name: hello-goodbye
  params:
  - name: username
    value: "Tekton"
```

## Installation & Setup

### Creating a Kubernetes Cluster with minikube

- **Command:**

```bash
minikube start --kubernetes-version v1.30.2
```

- **Verification:**

```bash
kubectl cluster-info
```

### Installing Tekton Pipelines

- **Command:**

```bash
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
```

- **Monitor Installation:**

```bash
kubectl get pods --namespace tekton-pipelines --watch
```

## Task and Pipeline Execution Examples

### Create and Run a Task
1. Create file `hello-world.yaml`:

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: hello
spec:
  steps:
    - name: echo
      image: alpine
      script: |
        #!/bin/sh
        echo "Hello World"
```

2. Apply Task:

```bash
kubectl apply --filename hello-world.yaml
```

3. Create file `hello-world-run.yaml`:

```yaml
apiVersion: tekton.dev/v1beta1
kind: TaskRun
metadata:
  name: hello-task-run
spec:
  taskRef:
    name: hello
```

4. Launch TaskRun:

```bash
kubectl apply --filename hello-world-run.yaml
```

5. Check TaskRun status:

```bash
kubectl get taskrun hello-task-run
```

6. Verify Logs:

```bash
kubectl logs --selector=tekton.dev/taskRun=hello-task-run
```

### Create and Run a Pipeline
1. Create file `goodbye-world.yaml`:

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: goodbye
spec:
  params:
  - name: username
    type: string
  steps:
    - name: goodbye
      image: ubuntu
      script: |
        #!/bin/bash
        echo "Goodbye $(params.username)!"
```

2. Apply the Task:

```bash
kubectl apply --filename goodbye-world.yaml
```

3. Create file `hello-goodbye-pipeline.yaml`:

```yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: hello-goodbye
spec:
  params:
  - name: username
    type: string
  tasks:
    - name: hello
      taskRef:
        name: hello
    - name: goodbye
      runAfter:
        - hello
      taskRef:
        name: goodbye
      params:
      - name: username
        value: $(params.username)
```

4. Apply the Pipeline:

```bash
kubectl apply --filename hello-goodbye-pipeline.yaml
```

5. Create file `hello-goodbye-pipeline-run.yaml`:

```yaml
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: hello-goodbye-run
spec:
  pipelineRef:
    name: hello-goodbye
  params:
  - name: username
    value: "Tekton"
```

6. Start the PipelineRun:

```bash
kubectl apply --filename hello-goodbye-pipeline-run.yaml
```

7. View Pipeline logs using Tekton CLI:

```bash
tkn pipelinerun logs hello-goodbye-run -f -n default
```

## Troubleshooting & Cleanup

### Cluster Troubleshooting
- **Command:**

```bash
kubectl cluster-info dump
```

### Deleting the minikube Cluster

```bash
minikube delete
```

Expected Output:
- Confirmation messages indicating deletion of the cluster and its resources.


## Attribution
- Source: Tekton Pipelines Documentation
- URL: https://tekton.dev/docs/pipelines/
- License: License: Apache License 2.0
- Crawl Date: 2025-04-17T14:43:59.198Z
- Data Size: 887477 bytes
- Links Found: 8424

## Retrieved
2025-04-17
