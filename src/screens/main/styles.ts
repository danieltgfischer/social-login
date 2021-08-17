import styled from 'styled-components'
import { StatusBar } from 'react-native';

export const Container = styled.SafeAreaView`
 	align-items: center;
  justify-content: flex-start;
	height: 100%;
	padding: ${StatusBar.currentHeight}px 0 0;
`;

export const Image = styled.Image`
	height: 80px;
	width: 80px;
	border-radius: 80px;
	margin: 15px 0 0;
`;

export const Name = styled.Text`
	font-size: 24px;
`;

export const Email = styled.Text`
	font-size: 16px;

`;

export const Button = styled.TouchableOpacity`
	background-color: #3B5998;
	align-items: center;
	justify-content: center;
	align-self: center;
	margin: 40% 0 0;
`;

export const ButtonLabel = styled.Text`
	color: #fff;
	font-size: 16px;
	padding: 10px;
`;
