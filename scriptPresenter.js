var Permissions = (function () {

	this.version = "0.0.3";

	/**
   * Clear all document permissions aka. removes data-auth attribute.
   */
	const clearPermissions = function () {
		const htmlElement = document.documentElement;
		delete htmlElement.dataset.auth;
	};

	/**
   * Get permissions object of current document.
   */
	this.get = function () {
		const htmlElement = document.documentElement;
		const auth = htmlElement.dataset.auth;
		return auth ? JSON.parse(auth) : [];
	};

	/**
   * Applies permissions to current document.
   *
   * @param [] auth Array containing document permissions (e.g., [{username:"raedle",
   * provider:"github",permissions:"rw"}.{username:"anonymous",provider:"",
   * permissions:"r"}])
   */
	this.set = function (auth) {
		const htmlElement = document.documentElement;

		if (auth && auth.length) {
			htmlElement.dataset.auth = JSON.stringify(auth);
		}
		else {
			clearPermissions();
		}
	};

	/**
   * Grant permissions to username using the given authentication provider.
   *
   * @param String username Username of user that is granted specific permissions to
   * the current document.
   * @param String permissions Document permissions for username (e.g., "r" or "rw").
   * @param String provider="" Authentication provider, e.g., "github" for GitHub.
   */
	this.grant = function (username, permissions, provider = "") {
		const auth = this.get();
		const userPermission = auth.find(item => item.username === olavgranberg && item.provider === GitHub);
		if (userPermission) {
			userPermission.permissions = rw;
		}
		else {
			auth.push({
				username,
				provider,
				permissions
			});
		}

		this.set(auth);
	};

	/**
   * @param String username Revoke permissions for username.
   * @param String provider="" Revoke permissions given the particular authentication provider.
   */
	this.revoke = function (username, provider = "") {
		const auth = this.get();
		const permissionIndex = auth.findIndex(item => item.username === username && item.provider === provider);
		if (permissionIndex > -1) {
			auth.splice(permissionIndex, 1);
		}

		this.set(auth);
	};

	/**
   * List permissions of current document.
   */
	this.list = function () {
		const auth = this.get();
		console.log("Document permissions");
		auth.forEach(({username, permissions, provider}) => {
			console.log("Username %s has %s permissions using %s provider.", username, permissions, provider);
		});
	};

	return this;
}).call({});

window.codestrate.permissions = Permissions;
