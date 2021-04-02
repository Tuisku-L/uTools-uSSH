import React from "react";
import linq from "linq";
import { Button, Col, Layout, Menu, Row, Modal, message, Input, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import HostList from "@/components/HostList";
import CreateGroup from "@/components/CreateGroup";

import * as Services from "@/utils/uToolsDb";
import { Group, Host } from "@/@types/entities";

import styles from "./styles.less";

interface IProps {

}

interface IState {
    isInit: boolean;
    groups: Array<Group>;
    currentGroup: string;
    modalDisplay: boolean;
    editGroup: Group | undefined;
}

export default class Index extends React.Component<IProps, IState>{
    pwdInput: any;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isInit: false,
            groups: [],
            currentGroup: "group|fixed",
            modalDisplay: false,
            editGroup: undefined
        };
    }

    componentDidMount = () => {
        // this.actionInitDefaultGroup();
        window.utools.onPluginReady(() => {
            this.setState({
                isInit: true
            }, () => {
                this.actionInitDefaultGroup();
            });
        });
    }

    actionInitDefaultGroup = () => {
        const group = Services.GetGroup("group|fixed");
        if (!group) {
            Services.createOrUpdateGroup({
                _id: "group|fixed",
                name: "常用",
                password: "",
                sort: -1,
                createDate: Date.now()
            });
        }
        this.actionGetGroup();
    }

    actionGetGroup = () => {
        let groups = Services.GetGroups();
        groups = linq.from(groups).orderBy(x => x.sort).toArray();
        console.info("groups", groups)
        this.setState({
            groups,
            modalDisplay: false
        });
    }

    actionOnPwdAction = (group: Group, cb: Function) => {
        if (group.password && group.password !== "") {
            Modal.warning({
                title: "操作前请输入分组查看密码",
                content: <div style={{ padding: "1em 0" }}>
                    <Input.Password ref={ref => this.pwdInput = ref} />
                </div>,
                closable: true,
                onOk: () => {
                    const pwd = this.pwdInput.state.value;
                    if (pwd && pwd !== "") {
                        if (pwd === group.password) {
                            return Promise.resolve(cb());
                        } else {
                            return Promise.reject(message.warning("密码错误"));
                        }
                    } else {
                        return Promise.reject(message.warning("请输入密码"));
                    }
                }
            });
        } else {
            cb();
        }
    }

    public render = () => {
        const { isInit, groups, currentGroup, modalDisplay, editGroup } = this.state;

        if (!isInit) {
            return <Spin />;
        }

        return (
            <Layout style={{ minHeight: "100%" }}>
                <Layout.Sider theme="light">
                    <div style={{ padding: "1em" }}>
                        <Button
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={() => this.setState({ modalDisplay: true })}
                        >
                            添加分组
                        </Button>
                    </div>
                    <div>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={["group|fixed"]}
                            onClick={menu => {
                                this.setState({
                                    currentGroup: menu.key.toString()
                                })
                            }}
                            selectedKeys={[currentGroup]}
                        >
                            {
                                groups.map(group =>
                                    <Menu.Item key={group._id}>
                                        <div className={styles.groupLine}>
                                            <Row>
                                                <Col span={18}>
                                                    {group.name}
                                                </Col>
                                                {
                                                    !group._id.includes("group|fixed") &&
                                                    <Col span={6} className={styles.actionBox}>
                                                        <EditOutlined
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.actionOnPwdAction(group, () => this.setState({ modalDisplay: true, editGroup: group }));
                                                            }}
                                                        />
                                                        <DeleteOutlined
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.actionOnPwdAction(group, () => {
                                                                    Modal.confirm({
                                                                        title: "提示",
                                                                        content: `是否确认删除分组 ${group.name}，分组下的服务器也将一并删除。`,
                                                                        onOk: () => {
                                                                            const result = Services.removeGroup(group._id);
                                                                            console.info("group._id", group._id, result)
                                                                            if (result) {
                                                                                this.actionInitDefaultGroup();
                                                                                this.setState({
                                                                                    currentGroup: "group|fixed"
                                                                                }, () => {
                                                                                    return Promise.resolve(message.success("删除成功"));
                                                                                });
                                                                            } else {
                                                                                return Promise.reject(message.error("删除失败"));
                                                                            }
                                                                        }
                                                                    });
                                                                });
                                                            }}
                                                        />
                                                    </Col>
                                                }
                                            </Row>
                                        </div>
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
                <Modal
                    title={editGroup ? "编辑分组" : "添加分组"}
                    visible={modalDisplay}
                    footer={null}
                    destroyOnClose
                    onCancel={() => this.setState({ modalDisplay: false, editGroup: undefined })}
                    width={450}
                >
                    <CreateGroup
                        editGroup={editGroup}
                        onFinish={this.actionInitDefaultGroup}
                    />
                </Modal>
            </Layout>
        );
    }
}
