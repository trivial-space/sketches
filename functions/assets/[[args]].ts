interface Env {
	REMOTE_ASSETS_URL: string
}

export const onRequest: PagesFunction<Env> = async (c) => {
	const newUrl = c.env.REMOTE_ASSETS_URL
	const r = c.request as Request
	const url = r.url.replace(/.*assets\//, newUrl + '/')

	return fetch(url, r)
}
