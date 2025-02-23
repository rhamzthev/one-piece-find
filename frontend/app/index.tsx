import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Auth0Provider} from 'react-native-auth0';
import config from "@/auth0-configuration";
import Auth from "@/components/Auth";
import Main from "@/components/Main";

const App = () => {

    const isLoggedIn = true;

    if (isLoggedIn)
        return <Main/>
    else
        return <Auth/>
}

export default function Home() {
    return <Auth0Provider domain={config.domain} clientId={config.clientId}>
        <App/>
    </Auth0Provider>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E53935', // Red color reminiscent of Luffy's vest
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color reminiscent of the One Piece
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 50,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  joinButton: {
    backgroundColor: '#FFD700', // Gold color
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
    marginBottom: 20,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  joinButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  loginText: {
    fontSize: 18,
    color: '#FFF',
    textDecorationLine: 'underline',
  },
});