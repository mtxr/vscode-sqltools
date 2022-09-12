export const SITE = {
	title: 'SQLTools',
	description: 'VScode SQLTools.',
	defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/header-hero.svg?sanitize=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'astrodotbuild',
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
};

export const KNOWN_LANGUAGES = {
	English: '',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/mtxr/vscode-sqltools/blob/dev/docs`;

export const COMMUNITY_INVITE_URL = ``;

// @TODO waiting for algolia doc search approval
export const ALGOLIA = {
	indexName: '',
	appId: '',
	apiKey: '',
};

export type SidebarEntry = { text: string; link: string } | SidebarGroup;
export type SidebarGroup = Record<string, { order: number; items: SidebarEntry[] }>

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	SidebarGroup
>;

export const SIDEBAR: Sidebar = {
	'': {
		'Start Here': { items: [], order: 0 },
		// 'Guides': { items: [], order: 1 },
		'Features': { items: [], order: 2 },
		'Official Drivers': { items: [], order: 3 },
		'Community Drivers': { items: [], order: 4 },
		// 'Configuration': { items: [], order: 1 },
		'Contributing': { items: [], order: 7 },
	},
};
