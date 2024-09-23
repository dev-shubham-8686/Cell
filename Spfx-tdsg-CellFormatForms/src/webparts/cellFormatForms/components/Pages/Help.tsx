import * as React from "react";
import { FC } from "react";
import { Button } from "antd";

const Help: FC = () => {
  return (
    <section>
      <div>
        <img alt="" src={require("../../assets/welcome-light.png")} />
        <div>
          <Button type="primary">Antd Working</Button>
        </div>
      </div>
      <div>
        <h3>Welcome to SharePoint Framework!</h3>
        <p>
          The SharePoint Framework (SPFx) is a extensibility model for Microsoft
          Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to
          extend Microsoft 365 with automatic Single Sign On, automatic hosting
          and industry standard tooling.
        </p>
        <h4>Learn more about SPFx development:</h4>
        <ul>
          <li>
            <a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">
              SharePoint Framework Overview
            </a>
          </li>
          <li>
            <a
              href="https://aka.ms/spfx-yeoman-graph"
              target="_blank"
              rel="noreferrer"
            >
              Use Microsoft Graph in your solution
            </a>
          </li>
          <li>
            <a
              href="https://aka.ms/spfx-yeoman-teams"
              target="_blank"
              rel="noreferrer"
            >
              Build for Microsoft Teams using SharePoint Framework
            </a>
          </li>
          <li>
            <a
              href="https://aka.ms/spfx-yeoman-viva"
              target="_blank"
              rel="noreferrer"
            >
              Build for Microsoft Viva Connections using SharePoint Framework
            </a>
          </li>
          <li>
            <a
              href="https://aka.ms/spfx-yeoman-store"
              target="_blank"
              rel="noreferrer"
            >
              Publish SharePoint Framework applications to the marketplace
            </a>
          </li>
          <li>
            <a
              href="https://aka.ms/spfx-yeoman-api"
              target="_blank"
              rel="noreferrer"
            >
              SharePoint Framework API reference
            </a>
          </li>
          <li>
            <a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">
              Microsoft 365 Developer Community
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Help;
