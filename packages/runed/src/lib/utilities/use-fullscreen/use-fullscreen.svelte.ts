export interface UseFullscreenReturn {
	readonly isFullscreen: boolean;
	enter: () => Promise<void>;
	exit: () => Promise<void>;
	toggle: () => Promise<void>;
}

export function useFullscreen(el: () => HTMLElement | undefined): UseFullscreenReturn {
	let isFullscreen = $state(false);
	async function exit() {
		await document.exitFullscreen();
	}
	async function enter() {
		await el()?.requestFullscreen();
	}
	async function toggle() {
		if (!el()) return;
		if (isFullscreen) {
			await exit();
		} else {
			await enter();
		}
	}
	function updateFullscreenState() {
		isFullscreen = !!document.fullscreenElement;
	}
	$effect(() => {
		document.addEventListener("fullscreenchange", updateFullscreenState);
		return () => {
			document.removeEventListener("fullscreenchange", updateFullscreenState);
		};
	});
	return {
		get isFullscreen() {
			return isFullscreen;
		},
		enter,
		exit,
		toggle,
	};
}
