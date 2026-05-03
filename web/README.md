# Playwright Tests

### Installation

``` pnpm create playwright ```

### Running the tests

``` pnpm exec playwright test ```

Tips:

 - See the browser window: add `--headed`.
 - Run a single project/browser: `--project=chromium`.
 - Run one file: `npx playwright test tests/example.spec.ts`.
 - Open testing UI: `--ui`. 


### Test Reports

```pnpm exec playwright show-report```

#### Ui mode

```pnpm exec playwright test --ui```


## Run Tests

### Run Tests in headed mode

``` pnpm exec playwright test --headed```

### Run in multiple browsers specified

```pnpm exec playwright test --project webkit --project firefox```

### Run specific tests

```pnpm exec playwright test landing-page.spec.ts```

Run specific folder of tests

```pnpm exec playwright test tests/todo-page/ tests/landing-page/```

Run specific test with a title

```pnpm exec playwright test -g "add a todo item"```

## Debug Tests

``` pnpm exec playwright test --debug ```

