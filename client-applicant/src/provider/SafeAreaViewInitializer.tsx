import { useEffect } from 'react';
import { SafeArea } from 'capacitor-plugin-safe-area';

const SafeAreaViewInitializer = () => {
	useEffect(() => {
		const setSafeAreaInsets = async () => {
			try {
				const { insets } = await SafeArea.getSafeAreaInsets();
				for (const [key, value] of Object.entries(insets)) {
					document.documentElement.style.setProperty(
						`--safe-area-inset-${key}`,
						`${value}px`
					);
				}
			} catch {
				// No need to handle here, just fallback to default values
			}
		};
		setSafeAreaInsets();
	}, []);

	return null;
};

export default SafeAreaViewInitializer;
