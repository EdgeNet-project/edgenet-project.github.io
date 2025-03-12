## Prerequisites

To run an experiment, you need to have [Docker](https://www.docker.com/) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
installed on your machine.
You can find the installation instructions on their respective websites.
You will also need a free account on [Docker Hub](https://hub.docker.com/) to store your container images.

## Building a container image

Let's consider a simple scenario where we want to serve a static web page.
We will define two files in `simple-experiment` directory: the web page `index.html`, and the _Dockerfile_.

```bash
simple-experiment/
├── Dockerfile
└── index.html
```

The `index.html` file contains a minimal HTML page:
```html
<!-- index.html -->
<html><body>Hello World!</body></html>
```

The `Dockerfile` contains the instructions needed to build the container image.
We will use Python's built-in web server to serve the page.
Start with an image from [Docker Hub](https://hub.docker.com/) that has Python pre-installed:
```dockerfile
# Dockerfile
FROM python:latest
ADD index.html /data/index.html
CMD python3 -m http.server -d /data 80
```

We can then build and test our image locally:
```bash
docker build -t simple-experiment .
docker run -p 8080:80 -it simple-experiment
curl http://localhost:8080 # (In another terminal)
# <html><body>Hello World!</body></html>
```

Once we've tested our image, we can tag it and push it to the [Docker Hub](https://hub.docker.com/) registry.
To do so, first [create a repository](https://hub.docker.com/repository/create) on Docker Hub:

![Docker Hub - Create Repository]({{ site.baseurl }}/assets/images/docker-hub-repository.png)

Then run the following commands, replacing _username_ with your Docker Hub user name:
```bash
docker login
docker tag simple-experiment username/simple-experiment:1.0
docker push username/simple-experiment:1.0
```