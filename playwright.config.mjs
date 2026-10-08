import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4321' },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: process.env.REVA_CHROMIUM ? {
          executablePath: process.env.REVA_CHROMIUM,
          args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-zygote'],
        } : {},
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'python3 -m http.server 4321 --directory docs/dist',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
  reporter: 'list',
});
