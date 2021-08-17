import React, { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import axios from 'axios';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import Constants from 'expo-constants'
import {
	useAuthRequest,
} from 'expo-auth-session';
import { Container, Image, Name, Email, Button, ButtonLabel } from './styles';

maybeCompleteAuthSession();

const useProxy = Constants.appOwnership === 'expo';

const oAuthConfig = {
	config: {
		facebook: {
			clientId: '133725382270274',
			scopes: ['public_profile', 'user_likes', 'email'],
			useProxy,
			redirectUri: 'https://auth.expo.io/@danieltfischer/social-login',
			extraParams: {
				display: Platform.select({ web: 'popup' })
			}
		}
	},
	discovery: {
		facebook: {
			authorizationEndpoint: 'https://www.facebook.com/v11.0/dialog/oauth',
			tokenEndpoint: 'https://graph.facebook.com/v11.0/oauth/access_token'
		},
		slack: {
			authorizationEndpoint: 'https://slack.com/oauth/authorize',
			tokenEndpoint: 'https://slack.com/api/oauth.access',
		}
	}
}

interface IResponse {
	name: string;
	email: string;
	url: string;
	access_token: string;
	expires_in?: string;
}

export const Main: React.FC = () => {
	const [OAuth, setOAuth] = useState<IResponse>()
	const { config, discovery } = oAuthConfig;
	const [request, response, promptAsync] = useAuthRequest(config.facebook, discovery.facebook);

	const handleFbOAuth = useCallback(async () => {
		if (!response || response['type'] !== 'success') {
			return
		}

		const URL = `https://graph.facebook.com/v11.0/oauth/access_token?client_id=133725382270274&redirect_uri=https://auth.expo.io/@danieltfischer/social-login&client_secret=2319addec879a8bfbe3938f25c592b13&code=${response.params?.code}`
		const { data } = await axios.post(URL, {
			redirectUri: config.facebook['redirectUri'],
			code: response['params']['code']
		})
		const fbUserInfo = await axios.get(`https://graph.facebook.com/v11.0/me?fields=name,email,picture.type(large)&access_token=${data?.access_token}`)
		setOAuth({
			name: fbUserInfo?.data?.name,
			email: fbUserInfo?.data?.email,
			url: fbUserInfo?.data?.picture?.data?.url,
			access_token: data?.access_token,
			expires_in: data?.expires_in
		})
	}, [response, OAuth]);

	React.useEffect(() => {
		handleFbOAuth()
	}, [handleFbOAuth])

	return (
		<Container>
			{OAuth?.url &&
				<Image source={{ uri: OAuth?.url }} resizeMode="contain" />
			}
			<Name>{OAuth?.name ?? ''}</Name>
			<Email> {OAuth?.email ?? ''}</Email>
			<Button
				onPress={() => {
					promptAsync({ useProxy })
				}}
			>
				<ButtonLabel>Login com Facebook</ButtonLabel>
			</Button>
		</Container>
	)
}
