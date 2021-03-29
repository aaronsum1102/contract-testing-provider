PACTICIPANT := "person-provider"
PACT_CLI="docker run --rm -v ${PWD}:${PWD} -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli:latest"

ci: test can_i_deploy 

fake_ci: .env
		@CI=true \
		COMMIT_HASH=`git rev-parse --short HEAD` \
		PACT_BROKER_PUBLISH_VERIFICATION_RESULTS=true \
		make ci

test: .env
		@echo "\n========== STAGE: test (pact) ==========\n"
		yarn run test



deploy: deploy_app tag_as_prod

can_i_deploy: .env
		@echo "\n========== STAGE: can-i-deploy? ==========\n"
		@"${PACT_CLI}" broker can-i-deploy \
			--pacticipant ${PACTICIPANT} \
			--version ${COMMIT_HASH} \
			--to ${DEPLOY_TARGET}

deploy_app:
	@echo "Deploying to prod"

tag_as_prod:
	"${PACT_CLI}" broker create-version-tag \
	  --pacticipant ${PACTICIPANT} \
	  --version ${TRAVIS_COMMIT} \
	  --tag ${DEPLOY_TARGET}

.env:
	touch .env

output:
	mkdir -p ./pacts
	touch ./pacts/tmp

clean: output
	rm pacts/*