'use babel';

import { CompositeDisposable } from 'atom';
import { generateRange } from 'atom-linter';

import * as path from 'path';
import * as markuplint from 'markuplint';

let subscriptions;

/**
 *
 */
export function activate () {
	console.info('activate <markuplint>');

	require('atom-package-deps').install('linter-markuplint');

	subscriptions = new CompositeDisposable();
}

/**
 *
 */
export function deactivate () {
	subscriptions.dispose();
}

/**
 *
 */
export function provideLinter () {
	return {
		name: 'markuplint',
		grammarScopes: [
			'text.html.basic',
			'text.html.vue',
		],
		scope: 'file',
		lintsOnChange: true,
		async lint (editor) {
			const filePath = editor.getPath();
			const html = editor.getText();
			const dir = path.dirname(filePath);

			const reports = await markuplint.verifyOnWorkspace(html, dir);

			return reports.map((report) => {
				return {
					severity: report.severity,
					location: {
						file: filePath,
						position: generateRange(editor, report.line - 1, report.col - 1),
					},
					excerpt: `${report.message} (${report.ruleId})`,
				};
			});
		},
	};
}
