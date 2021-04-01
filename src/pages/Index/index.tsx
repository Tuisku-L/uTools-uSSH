import React from "react";
import { Button, Layout, Menu } from 'antd';
import HostList from "@/components/HostList";

import * as Services from "@/utils/uToolsDb";
import { Group, Host } from "@/@types/entities";

interface IProps {

}

interface IState {
    groups: Array<Group>;
    currentGroup: string;
}

export default class Index extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);
        this.state = {
            groups: [],
            currentGroup: "fixed"
        };
    }

    componentDidMount = () => {
        const groups = Services.GetGroups();
        this.setState({
            groups
        });
    }


    public render = () => {
        const { groups, currentGroup } = this.state;

        return (
            <Layout style={{ minHeight: "100%" }}>
                <Layout.Sider theme="light">
                    <div style={{ padding: "1em" }}>
                        <Button type="primary" style={{ width: "100%" }}>添加分组</Button>
                    </div>
                    <div>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={["fixed"]}
                            onClick={menu => {
                                this.setState({
                                    currentGroup: menu.key.toString()
                                })
                            }}
                        >
                            <Menu.Item key="fixed">
                                常用
                            </Menu.Item>
                            {
                                groups.map(group =>
                                    <Menu.Item key={group._id}>
                                        {group.name}
                                    </Menu.Item>
                                )
                            }
                        </Menu>
                    </div>
                </Layout.Sider>
                <Layout>
                    <Layout.Content>
                        <div style={{ padding: "1em" }}>
                            <HostList groupId={currentGroup} />
                        </div>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}
