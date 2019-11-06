// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ipcRenderer } from "electron";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../common/assets/logo.png";

import { openModal } from "../../../common/reducers/modals/actions";
import { _getCurrentAccount } from "../../../common/utils/selectors";

export const Container = styled.div`
  width: 100vw;
  height: ${({ theme }) => theme.sizes.height.navbar};
  -webkit-user-select: none;
  display: flex;
  justify-content: space-between;
`;

export const SettingsButton = styled.div`
  position: absolute;
  right: 250px;
  font-size: 22px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: white;
    transition: all 0.2s ease-in-out;
  }
  path {
    cursor: pointer;
  }
  path:hover {
    color: white;
    transition: all 0.2s ease-in-out;
  }
`;

export const UpdateButton = styled.div`
  z-index: 10;
  text-align: center;
  a {
    text-decoration: none;
    display: block;
  }
`;

export const NavigationContainer = styled.div`
  -webkit-app-region: no-drag;
  font-weight: 700;
  font-size: 16px;
  height: ${({ theme }) => theme.sizes.height.navbar};
  width: 100%;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

export const NavigationElement = styled.li`
  display: inline;
  cursor: pointer;
  &:hover a,
  &:active a,
  &:focus a {
    text-decoration: none !important;
  }
  a {
    position: relative;
    display: inline-block;
    line-height: 30px;
    color: white;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    svg {
      cursor: pointer;
      path {
        cursor: pointer;
      }
    }
  }
`;

const ProfileSettings = styled.div`
  display: flex;
  justify-content: flex-left;
  align-items: center;
  width: 255px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: ${props => props.theme.palette.grey[500]};
  }
`;

const ProfileImg = styled.div`
  width: 30px;
  height: 30px;
  background: ${props => props.theme.palette.grey[900]};
  border-radius: 50%;
  margin-right: 10px;
`;

const Navbar = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const account = useSelector(_getCurrentAccount);
  const location = useSelector(state => state.router.location.pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      ipcRenderer.send("check-for-updates");
      ipcRenderer.on("update-available", () => {
        setUpdateAvailable(true);
      });
    }
  }, []);

  const isLocation = loc => {
    if (loc === location) {
      return true;
    }
    return false;
  };

  if (isLocation("/")) return null;
  return (
    <Container>
      <img
        src={logo}
        height="36px"
        alt="logo"
        draggable="false"
        css={`
          z-index: 1;
        `}
      />
      <NavigationContainer>
        {/* <NavigationElement>
          <Link to="/home" draggable="false">
            <Button selected={isLocation("/home")}>Home</Button>
          </Link>
        </NavigationElement> */}
      </NavigationContainer>
      <SettingsButton>
        <FontAwesomeIcon
          icon={faCog}
          onClick={() => dispatch(openModal("Settings"))}
          css={`
            display: inline-block;
            vertical-align: middle;
          `}
        />
      </SettingsButton>
      <ProfileSettings onClick={() => dispatch(openModal("AccountsManager"))}>
        <ProfileImg />
        {account && account.selectedProfile.name}
      </ProfileSettings>
      {updateAvailable && (
        <UpdateButton>
          <Link to="/autoUpdate">
            <Button type="primary">Update Available</Button>
          </Link>
        </UpdateButton>
      )}
    </Container>
  );
};

export default Navbar;