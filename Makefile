.PHONY: all
all: bundle build

.PHONY: bundle
bundle:
	bundle --path vendor/bundle

.PHONY: build
build:
	bundle exec jekyll build

.PHONY: clean
clean:
	bundle exec jekyll clean

.PHONY: server
server:
	bundle exec jekyll server -l
