import { themes as prismThemes } from 'prism-react-renderer';


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Welcome to Ressonance Docs',
  tagline: '',
  favicon: 'img/logo.png',

  future: {
    v4: true,
  },

  url: 'https://ressonancia.github.io',
  // url: 'https://docs.ressonance.com',
  baseUrl: '/docs',
  organizationName: 'ressonancia',
  projectName: 'docs',
  trailingSlash: false,
  deploymentBranch: 'master',
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Ressonance Docs',
        logo: {
          alt: 'Ressonance Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://github.com/ressonancia',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'X',
                href: 'https://x.com/@RessonanceCom',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/ressonancia',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Ressonance.com`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
