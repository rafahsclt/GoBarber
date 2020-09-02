import styled, { css } from 'styled-components/native'
import { FlatList } from 'react-native'
import { Provider } from './index'
import { RectButton } from 'react-native-gesture-handler'

interface ProviderProps {
  selected: boolean
}

export const Container = styled.View`
  flex: 1;
`

export const Header = styled.View`
  padding: 24px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const BackButton = styled.TouchableOpacity`

`

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  margin-left: 16px;
`

export const UserAvatar= styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`

export const ProviderListContainer = styled.View`
  height: 112px;
`

export const ProviderList = styled(FlatList as new () => FlatList<Provider>)`
  padding: 32px 24px;
`
export const ProviderContainer = styled(RectButton)<ProviderProps>`
  background: ${props => props.selected ? '#ff9000' : '#3e3b47'};
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-right: 16px;
  border-radius: 10px;
`

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`

export const ProviderName = styled.Text<ProviderProps>`
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  color: ${props => props.selected ? '#232129' : '#f4ede8'};
`
