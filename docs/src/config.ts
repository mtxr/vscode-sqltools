export const SITE = {
	title: 'SQLTools',
	description: 'VScode SQLTools.',
	defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/header-hero.png',
		alt:
			'SQLTools database management',
	},
	twitter: 'GJSoftware',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	header?: string; // to show on the sidebar
	layout?: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
	redirect?: string;
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const COMMUNITY_INVITE_URL = ``;

// @TODO waiting for algolia doc search approval
export const ALGOLIA = {
	indexName: 'vscode-sqltools',
	appId: 'WSQ0K6SUHV',
	apiKey: '43437b610c31c376dec0e0d92e1eb4cc',
};

export type SidebarEntry = { text: string; link: string } | SidebarGroup;
export type SidebarGroup = Record<string, { order: number; items: SidebarEntry[] }>

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	SidebarGroup
>;

export const SIDEBAR: Sidebar = {
	'en': {
		'Start Here': { items: [], order: 0 },
		'Configuration': { items: [], order: 1 },
		'Guides': { items: [], order: 1 },
		'Features': { items: [], order: 2 },
		'Official Drivers': { items: [], order: 3 },
		'Community Drivers': { items: [], order: 4 },
		'Playground': { items: [], order: 5 },
		'Contributing': { items: [], order: 7 },
	},
};
