import React from "react";
import * as Services from "@/utils/uToolsDb";

import { Button, Col, Divider, Empty, Row, Modal } from "antd";
import CreateHost from "@/components/CreateHost";
import HostCard from "@/components/HostCard";

import { Host } from "@/@types/entities";

interface IProps {
    groupId: string;
}

interface IState {
    hosts: Array<Host>;
    modalDisplay: boolean;
}

export default class HostList extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);
        this.state = {
            hosts: [],
            modalDisplay: false
        };
    }

    componentDidMount = () => {
        this.actionGetHostByGroupId(this.props.groupId);
    }

    UNSAFE_componentWillReceiveProps = (nextProps: IProps) => {
        if (nextProps.groupId !== this.props.groupId) {
            this.actionGetHostByGroupId(nextProps.groupId);
        }
    }

    actionGetHostByGroupId = (groupId: string) => {
        const hosts = Services.GetHostsByGroupId(groupId);
        console.info("hosts", hosts)
        this.setState({
            hosts
        });
    }

    actionCreateOrUpdateFinish = () => {
        this.setState({
            modalDisplay: false
        }, () => {
            this.actionGetHostByGroupId(this.props.groupId);
        });
    }

    public render = () => {
        const { hosts, modalDisplay } = this.state;

        return <div>
            <Row>
                <Col span={20}>
                    <div style={{ fontSize: "1.3em" }}>{this.props.groupId}</div>
                </Col>
                <Col span={4} style={{ textAlign: "right" }}>
                    <Button
                        type="primary"
                        onClick={() => this.setState({ modalDisplay: true })}
                    >
                        添加服务器
                    </Button>
                </Col>
            </Row>
            <Divider style={{ margin: "1em auto" }} />
            <div>
                {
                    hosts.length > 0 ?
                        <Row gutter={16}>
                            {
                                hosts.map(host =>
                                    <Col span={8} key={host._id}>
                                        <HostCard host={host} />
                                    </Col>
                                )
                            }
                        </Row> :
                        <Empty description="暂无服务器" />
                }
            </div>
            <Modal
                visible={modalDisplay}
                title="添加服务器"
                onCancel={() => this.setState({ modalDisplay: false })}
                footer={false}
            >
                {
                    modalDisplay &&
                    <CreateHost
                        groupId={this.props.groupId}
                        onFinish={this.actionCreateOrUpdateFinish}
                    />
                }
            </Modal>
        </div>;
    }
}
