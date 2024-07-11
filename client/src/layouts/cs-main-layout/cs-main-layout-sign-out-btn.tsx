import { device } from "@/styles";
import { FC } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import styled from "styled-components";
import { IconWrapper, NavItemContainer } from "./cs-main-layout-nav-item";
import { CSCommonTooltip } from "@/components";

type Props = {
    signOutHandler: () => Promise<void>
}

export const CSMainLayoutSignOutBtn: FC<Props> = ({ signOutHandler }) => {
    return (
        <NavItemContainer>
            <SignOutButton onClick={signOutHandler}>
                <IconWrapper>
                    <FaSignOutAlt />
                </IconWrapper>
                <span>Sign Out</span>
                <Tooltip className="tooltip">Sign Out</Tooltip>
            </SignOutButton>
        </NavItemContainer>
    )
}

const Tooltip = styled(CSCommonTooltip)`
  @media ${device.lg} {
    opacity: 0;
    visibility: hidden;
  }
`;


const SignOutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--gray-blue);

  span {
    font-size: 16px;
    display: none;

    @media ${device.lg} {
      display: flex;
    }
  }

  &:hover {
    color: #1e3a8a;
    }
  }
`;